// 유틸리티: 이메일 검증
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 유틸리티: 가격 검증
function isValidPrice(price) {
  return typeof price === 'number' && price > 0;
}

// 유틸리티: 주문 ID 생성
function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  isValidEmail,
  isValidPrice,
  generateOrderId
};
