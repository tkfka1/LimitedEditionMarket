import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { Modal, Button, Spinner } from 'react-bootstrap';

const selector = "#payment-widget";
const clientKey = process.env.REACT_APP_CLIENT_KEY;
const customerKey = process.env.REACT_APP_CUSTOMER_KEY;

function SuccessPage({ orderId, amount }) {
  return (
    <div className="result-page success">
      <h1 className="result-title">결제 성공</h1>
      <p className="result-detail">{`주문 아이디: ${orderId}`}</p>
      <p className="result-detail">{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
    </div>
  );
}

function FailPage({ message }) {
  return (
    <div className="result-page fail">
      <h1 className="result-title">결제 실패</h1>
      <p className="result-detail">{`사유: ${message}`}</p>
    </div>
  );
}

async function sendPaymentDataToServer(data) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export default function CheckoutPage({ onClose, price: initialPrice, productName, userInfo }) {

  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(initialPrice);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 결제 결과 상태
  const [orderId, setOrderId] = useState(null); // 주문 아이디 상태

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        selector,
        { value: price }
      );

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, []);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget == null) {
      return;
    }
    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>결제</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {paymentStatus === "success" && <SuccessPage orderId={orderId} amount={price} />}
        {paymentStatus === "fail" && <FailPage message="결제에 실패했습니다." />}

        {!paymentStatus && (
          <>
            <h1>주문서</h1>
            <div>
              <strong>이름:</strong> {userInfo.username}
            </div>
            <div>
              <strong>이메일:</strong> {userInfo.email}
            </div>
            <strong>가격: </strong><span>{`${price.toLocaleString()}원`}</span>
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={(event) => {
                    setPrice(event.target.checked ? price - 1_000 : price + 1_000);
                  }}
                />
                1,000원 할인 쿠폰 적용
              </label>
            </div>
            <div id="payment-widget" />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!paymentStatus && (
          <>
            <Button
              onClick={async () => {
                setLoading(true);
                const paymentWidget = paymentWidgetRef.current;
                const newOrderId = nanoid();
                try {
                  await paymentWidget?.requestPayment({
                    orderId: newOrderId,
                    orderName: productName,
                    customerName: userInfo.username,
                    customerEmail: userInfo.email
                  });
                  setPaymentStatus("success");
                  setOrderId(newOrderId);

                  // 결제가 성공하면 서버에 데이터를 전송
                  const data = {
                    orderId: newOrderId,
                    amount: price,
                    orderName: productName,
                    customerId: userInfo.id,
                  };
                  await sendPaymentDataToServer(data);

                } catch (error) {
                  setPaymentStatus("fail");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : '결제하기'}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}


