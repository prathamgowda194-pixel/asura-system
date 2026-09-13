import os
import json
import time
import urllib.parse
import requests

DEFAULT_TOKEN = "8909145509:AAF8UhbWxPR5JGt8ddcAd9D1gqZ3L13ZuAo"
DEFAULT_CHAT_ID = "7025916840"
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
SUBSCRIBERS_FILE = os.path.join(DATA_DIR, "telegram_subscribers.json")

class TelegramBot:
    def __init__(self, token=None):
        self.token = (token or os.environ.get("TELEGRAM_BOT_TOKEN") or DEFAULT_TOKEN).strip()
        self.api_url = f"https://api.telegram.org/bot{self.token}"
        self.last_update_id = 0
        os.makedirs(DATA_DIR, exist_ok=True)

    def get_me(self):
        try:
            r = requests.get(f"{self.api_url}/getMe", timeout=10)
            return r.json() if r.status_code == 200 else {"ok": False, "error": r.text}
        except Exception as e:
            return {"ok": False, "error": str(e)}

    def get_subscribers(self):
        subs = set()
        subs.add(DEFAULT_CHAT_ID)
        env_chat = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
        if env_chat:
            subs.add(str(env_chat))
        if os.path.exists(SUBSCRIBERS_FILE):
            try:
                with open(SUBSCRIBERS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for s in data:
                            subs.add(str(s))
            except Exception:
                pass
        return sorted(list(subs))

    def add_subscriber(self, chat_id):
        subs = set(self.get_subscribers())
        subs.add(str(chat_id))
        try:
            with open(SUBSCRIBERS_FILE, "w", encoding="utf-8") as f:
                json.dump(sorted(list(subs)), f, indent=2)
        except Exception:
            pass

    def sync_updates(self):
        """Polls for new users and command inputs."""
        params = {"timeout": 2}
        if self.last_update_id:
            params["offset"] = self.last_update_id + 1
        try:
            r = requests.get(f"{self.api_url}/getUpdates", params=params, timeout=6)
            if r.status_code == 200:
                data = r.json()
                if data.get("ok"):
                    for u in data.get("result", []):
                        self.last_update_id = max(self.last_update_id, u.get("update_id", 0))
                        msg = u.get("message", {})
                        chat = msg.get("chat", {})
                        chat_id = chat.get("id")
                        text = msg.get("text", "").strip()
                        if chat_id:
                            self.add_subscriber(chat_id)
                            if text == "/start":
                                self.send_welcome(chat_id)
                    return data.get("result", [])
        except Exception:
            pass
        return []

    def send_message(self, chat_id, text, reply_markup=None, parse_mode="HTML"):
        payload = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": parse_mode,
            "disable_web_page_preview": False
        }
        if reply_markup:
            payload["reply_markup"] = reply_markup
        try:
            r = requests.post(f"{self.api_url}/sendMessage", json=payload, timeout=10)
            return r.status_code in (200, 201)
        except Exception:
            return False

    def broadcast(self, text, reply_markup=None):
        self.sync_updates()
        subs = self.get_subscribers()
        success = 0
        for s in subs:
            if self.send_message(s, text, reply_markup):
                success += 1
        return success

    def send_welcome(self, chat_id):
        welcome_text = (
            "⚡ <b>ASURA HUNTER ENGINE // ONLINE</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            "Greetings Commander. You are successfully paired with the <b>24/7 Autonomous Lead Matrix</b>.\n\n"
            "📡 <b>Scanning Engines:</b> OpenStreetMap Overpass + Firecrawl SERP + Dead-Domain Detector\n"
            "🎯 <b>Target Categories:</b> Dentists, Gyms, Roofers, Plumbers, Med Spas, Salons, Luxury Dining, Auto Care, Law\n"
            "⚡ <b>Auto-Prototype Pipeline:</b> ACTIVE (Live bespoke Vercel websites auto-synthesized for every lead)\n\n"
            "<b>Available Commands:</b>\n"
            "• <code>/hunt &lt;niche&gt; &lt;city&gt;</code> — Immediate on-demand client sweep\n"
            "• <code>/status</code> — System telemetry & conversion metrics\n"
            "• <code>/latest</code> — Display last 5 hot prospects\n\n"
            "<i>Standing by. Incoming leads will be dispatched in real-time.</i>"
        )
        markup = {
            "inline_keyboard": [
                [{"text": "🚀 Scan Dentists (Miami)", "callback_data": "hunt_dental_miami"}],
                [{"text": "⚡ Scan Gyms (Austin)", "callback_data": "hunt_gym_austin"}]
            ]
        }
        self.send_message(chat_id, welcome_text, markup)

    def send_lead_card(self, lead, prototype_url=None):
        name = lead.get("name", "Local Business")
        niche = lead.get("niche", "Commercial Services").title()
        city = lead.get("city", "United States").title()
        phone = lead.get("phone", "Not Listed")
        email = lead.get("email", "Direct Contact Needed")
        rating = lead.get("rating", "4.8")
        reviews = lead.get("reviews", "45")
        address = lead.get("address", city)

        card = (
            "🎯 <b>NEW CLIENT LEAD // NO WEBSITE DETECTED</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            f"🏢 <b>Business:</b> <b>{name}</b>\n"
            f"🏷 <b>Niche:</b> {niche}\n"
            f"📍 <b>Location:</b> {address}\n"
            f"📞 <b>Phone:</b> <code>{phone}</code>\n"
            f"✉️ <b>Email:</b> <code>{email}</code>\n"
            f"⭐ <b>Rating:</b> {rating} ★ ({reviews} reviews)\n"
            f"🌐 <b>Online Status:</b> ❌ <b>NO WEBSITE DETECTED</b>\n\n"
        )

        clean_digits = "".join(c for c in phone if c.isdigit())
        if len(clean_digits) == 10:
            clean_digits = "1" + clean_digits

        pitch_msg = (
            f"Hi {name}! I noticed your business has great customer ratings, "
            f"but doesn't currently have an official website. "
        )
        if prototype_url:
            card += (
                f"⚡ <b>AUTOMATED LIVE PROTOTYPE READY:</b>\n"
                f"👉 <code>{prototype_url}</code>\n\n"
                f"<i>💡 Asura auto-built and deployed this live client demo on Vercel so you can pitch immediately with zero friction!</i>"
            )
            pitch_msg += f"I built a custom live website prototype for you to see: {prototype_url} . Would you like to claim it?"
        else:
            card += "<i>💡 Prime prospect for immediate website sales outreach.</i>"

        encoded_pitch = urllib.parse.quote(pitch_msg)
        buttons = []

        if prototype_url:
            buttons.append([{"text": "🚀 Open Live Vercel Prototype ↗", "url": prototype_url}])

        actions = []
        if clean_digits and len(clean_digits) >= 10:
            actions.append({"text": "💬 WhatsApp Lead", "url": f"https://wa.me/{clean_digits}?text={encoded_pitch}"})
            actions.append({"text": "📞 Call Direct", "url": f"tel:+{clean_digits}"})

        if actions:
            buttons.append(actions)

        markup = {"inline_keyboard": buttons} if buttons else None
        return self.broadcast(card, markup)

if __name__ == "__main__":
    bot = TelegramBot()
    print("Bot Info:", bot.get_me())
    print("Subscribers:", bot.get_subscribers())
