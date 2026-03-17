import random
import time

otp_store = {}

OTP_EXPIRY = 300  # 5 minutes


def generate_otp():
    return str(random.randint(100000, 999999))


def save_otp(mobile: str, otp: str):
    otp_store[mobile] = {
        "otp": otp,
        "time": time.time()
    }


def verify_otp(mobile: str, otp: str) -> bool:
    data = otp_store.get(mobile)

    if not data:
        return False

    if time.time() - data["time"] > OTP_EXPIRY:
        otp_store.pop(mobile, None)
        return False

    if data["otp"] == otp:
        otp_store.pop(mobile, None)
        return True

    return False