import React, { useEffect, useState } from 'react';
import { createOrder, verifyPayment } from '../apis/paymentPage';
import { useNavigate } from 'react-router-dom';

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
            buyer_postcode: '01181',
          },
          async function (response) {
            if (response.success) {
              await verifyPayment(merchantUid, response.imp_uid);
              console.log('결제 성공:', response);
              alert('결제가 성공적으로 완료되었습니다.');
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
    { id: 1, price: 10000, name: '10000' },
    { id: 2, price: 20000, name: '20000' },
    { id: 3, price: 30000, name: '30000' },
  ];
  return (
    <div>
      <select
        id="point-select"
        value={pointMenuId}
        onChange={e => setPointMenuId(e.target.value)}
        className="post-category-select"
      >
        {pointMenus.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <button onClick={requestPay}>결제하기</button>
    </div>
  );
};

export default PaymentPage;
