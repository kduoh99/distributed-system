const { isValidEmail, isValidPrice, generateOrderId } = require('../../src/utils/validator');

describe('Validator Utils - Unit Tests', () => {
    describe('isValidEmail', () => {
        test('유효한 이메일을 검증할 수 있다', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.kr')).toBe(true);
    });

    test('유효하지 않은 이메일을 거부한다', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('')).toBe(false);
            expect(isValidEmail(null)).toBe(false);
        });
    });


    describe('isValidPrice', () => {
        test('양수 가격은 유효하다', () => {
            expect(isValidPrice(100)).toBe(true);
            expect(isValidPrice(0.01)).toBe(true);
        });

        test('0 이하 가격은 유효하지 않다', () => {
            expect(isValidPrice(0)).toBe(false);
            expect(isValidPrice(-10)).toBe(false);
        });

        test('숫자가 아닌 값은 유효하지 않다', () => {
            expect(isValidPrice('100')).toBe(false);
            expect(isValidPrice(null)).toBe(false);
            expect(isValidPrice(undefined)).toBe(false);
        });
    });

    describe('generateOrderId', () => {
        test('주문 ID를 생성할 수 있다', () => {
            const orderId = generateOrderId();
            expect(orderId).toMatch(/^ORD-\d+-[a-z0-9]+$/); // ORD-숫자-무작위문자
        });

        test('매번 다른 주문 ID를 생성한다', () => {
            const id1 = generateOrderId();
            const id2 = generateOrderId();
            expect(id1).not.toBe(id2);
        });
    });


})