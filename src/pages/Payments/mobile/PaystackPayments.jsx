import { useContext, useState, useEffect } from "react";
import { PaystackButton } from "react-paystack";
import { AuthContext } from "../../../AuthContext";
import { PriceContext } from "../../../PriceContext";
import {
  SUBSCRIPTION_PLANS,
  getSubscriptionPeriod,
  getPlanName,
  handleUpgrade,
} from "./paymentUtils";
import Swal from "sweetalert2";
import "./Payments.scss";

export default function PaystackPayments({ setUserData }) {
  const { price, setPrice } = useContext(PriceContext);
  const { currentUser } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  // Subscription plans (shillings)
  const subscriptionPlans = SUBSCRIPTION_PLANS.shillings;

  // Initialize price
  useEffect(() => {
    setPrice(subscriptionPlans[0].value);
  }, []);

  const handlePlanSelect = (planValue) => {
    setPrice(planValue);
  };

  const onPaystackSuccess = (response) => {
    console.log("Payment success response:", response);
    setProcessing(false);
    handleUpgrade(currentUser, price, setUserData);
  };

  const onPaystackClose = () => {
    console.log("Payment dialog closed");
    setProcessing(false);
  };

  const componentProps = {
    reference: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: currentUser?.email || "customer@example.com",
    amount: price * 100,
    publicKey: "pk_live_0b93a34f6265d8c2e8ca65ec33899b9a8a9077a9",
    currency: "KES",
    metadata: {
      name: currentUser?.email?.split("@")[0] || "Customer",
      plan: getPlanName(price),
      subscription_period: getSubscriptionPeriod(price),
    },
    text: "Pay Now",
    onSuccess: onPaystackSuccess,
    onClose: onPaystackClose,
  };

  const handlePaystackPayment = () => {
    if (!currentUser) {
      Swal.fire({
        title: "Login Required",
        text: "Please login first to continue with payment",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setProcessing(true);
  };

  return (
    <div className="paystack-payment-wrapper">
      <div className="plan-selector">
        {subscriptionPlans.map((plan) => (
          <label
            key={plan.id}
            className={`plan-option ${price === plan.value ? "active" : ""}`}
          >
            <input
              type="radio"
              name="subscription-plan"
              value={plan.value}
              checked={price === plan.value}
              onChange={() => handlePlanSelect(plan.value)}
            />
            <span className="plan-label">{plan.label}</span>
            <span className="plan-price">{plan.price}</span>
          </label>
        ))}
      </div>

      <div className="paystack-payment">
        <h3>
          GET {getPlanName(price).toUpperCase()} VIP FOR KSH {price}
        </h3>

        <PaystackButton
          {...componentProps}
          className="confirm-payment-btn"
          disabled={processing}
        />

        <p className="paystack-note">
          Secure payment via Paystack. Supports M-Pesa, Airtel Money, and Card
          payments.
        </p>
      </div>
    </div>
  );
}
