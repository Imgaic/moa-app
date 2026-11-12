// 테스트 러너가 도는지 확인하는 예시다. src/lib에 첫 로직 테스트가 생기면 지운다.
describe('jest', () => {
  it('runs a test', () => {
    expect(1 + 1).toBe(2);
  });
});
