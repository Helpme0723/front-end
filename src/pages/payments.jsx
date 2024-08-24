import React, { useEffect, useState } from 'react';
import { createOrder, refund, verifyPayment } from '../apis/paymentPage';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Payment.css';

const PaymentPage = () => {
  const [pointMenuId, setPointMenuId] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    document.body.appendChild(script);

    // 아임포트 초기화
    script.onload = () => {
      if (window.IMP) {
        window.IMP.init('imp55558125'); // 가맹점 식별코드
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const requestPay = async () => {
    try {
      const response = await createOrder(pointMenuId);
      const { merchantUid, amount } = response.data;

      if (window.IMP) {
        window.IMP.request_pay(
          {
            pg: 'uplus.tlgdacomxpay',
            pay_method: 'card',
            merchant_uid: merchantUid, // 주문 고유 번호
            name: '포인트 충전',
            amount: amount, // 주문된 금액을 사용
          },
          async function (response) {
            if (response.success) {
              try {
                await verifyPayment(merchantUid, response.imp_uid);
                alert('결제가 성공적으로 완료되었습니다.');
              } catch (error) {
                console.error('검증 실패', error);
                await refund(response.imp_uid);
                alert('결제 검증 과정에서 오류가 발생했습니다.');
              }
            } else {
              // 결제가 실패했을 때 로직
              console.error('결제 실패:', response);
              alert('결제에 실패했습니다.');
            }
            navigate(`/points`);
          },
        );
      }
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };
  const pointMenus = [
    { id: 1, price: 10000, name: '10000P' },
    { id: 2, price: 20000, name: '20000P' },
    { id: 3, price: 30000, name: '30000P' },
    { id: 4, price: 40000, name: '40000P' },
    { id: 5, price: 40000, name: '50000P' },
  ];
  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2>충전할 포인트</h2>
        <div className="radio-group">
          {pointMenus.map(option => (
            <label
              key={option.id}
              className={`radio-label ${pointMenuId === option.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="pointMenu"
                value={option.id}
                checked={pointMenuId === option.id}
                onChange={() => setPointMenuId(option.id)}
              />
              <span className="point-name">{option.name}</span>
              <span className="point-currency">{option.currency}</span>
            </label>
          ))}
        </div>
        <button onClick={requestPay} className="payment-button">
          결제하기
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
