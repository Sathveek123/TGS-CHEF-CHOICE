# TGS ChefChoice — Owner Operational & Anti-Fraud Handbook 📖

This document outlines the zero-cost payment workflow, fraud/prank order prevention rules, and WhatsApp script templates for restaurant owners **Tarakeswari & Balakrishna Gujju**.

---

## 1. 💰 Payment System (No-Gateway Setup)

### Overview
- **Payment Method:** Cash or UPI on Delivery / Counter Pickup.
- **Why No Payment Gateway?** No gateway fees (saves 2% per order), no merchant KYC delays, no transaction failure disputes.
- **Merchant Setup (10 minutes, Free):**
  1. Open a PhonePe Business, Google Pay for Business, or Paytm Business account using the restaurant's bank account.
  2. Obtain registered UPI ID (e.g. `tgschefchoice@okicici` or `9701325292@ybl`).
  3. Print a physical QR code for counter pickup and delivery staff.

### Dynamic WhatsApp UPI Deep-Links
When confirming an order via WhatsApp, the owner can send a tap-to-pay link:
```text
upi://pay?pa=YOUR_UPI_ID&pn=TGS%20ChefChoice&am=450&cu=INR
```
*(Replace `YOUR_UPI_ID` with the owner's actual UPI handle and `450` with the total order amount).*

---

## 2. 🛡️ Anti-Fraud & Fake Order Prevention

### Prevention Rules (Before Food Preparation)
1. **Real Mobile Number Validation:** Form requires a valid 10-digit Indian phone number (`[6-9][0-9]{9}`).
2. **Mandatory Phone Call Confirmation:**
   - **Everyday Orders:** For any first-time number or order exceeding **₹1,500**, staff MUST call the customer to verbally confirm items and delivery location before kitchen prep starts.
   - **Known Regulars:** Call-back friction is skipped for repeat customers.
3. **Catering & Large Group Deposit (15+ Guests):** Require a small advance deposit (₹300 – ₹500) via UPI to lock in event dates and raw ingredients.

---

## 3. 💬 WhatsApp Owner Reply Script Templates

### 🟢 Everyday Small Orders (Dine-In / Takeaway / Home Delivery)
```text
Namaste! 🙏 Order received & confirmed ✅

Order ID: [ORDER_ID]
Total: ₹[TOTAL_AMOUNT]
Estimated Prep Time: [X] minutes

Pay on delivery/pickup via Cash or UPI. Looking forward to serving you! 🍽️
```

---

### 👑 Large Catering & Event Booking Deposit Flow (15+ Guests)

#### Step 1 — Deposit Request (After receiving enquiry)
```text
Namaste! Thank you for your enquiry for [X] guests on [Date].

We'd love to host your celebration 🎉 For bookings of this size, we ask for a small advance of ₹[300/500] to confirm and reserve your date — this is fully adjusted against your final bill.

You can pay directly here:
upi://pay?pa=YOUR_UPI_ID&pn=TGS%20ChefChoice&am=[300/500]&cu=INR

Once received, your booking is confirmed ✅ We'll call you a day before to finalize the menu.
```

#### Step 2 — After Deposit is Received
```text
Received, thank you! ✅ Your event reservation for [X] guests on [Date] at [Time] is confirmed. 

We'll reach out a day before to go over final menu choices. Looking forward to celebrating with you! 🎊
```

#### Step 3 — 24-Hour Deposit Follow-Up Reminder
```text
Namaste! Just checking in about your booking for [Date] — we're holding the reservation but need the advance confirmed to lock it in. 

Let us know if you have any questions, happy to help! 😊
```

#### Step 4 — Handling Deposit Pushback
```text
We understand! The advance simply helps us prepare fresh ingredients properly and reserve space for your group, as we are a smaller family kitchen. 

It is 100% adjusted against your final bill, not an extra charge. Happy to answer any questions! 🙏
```
