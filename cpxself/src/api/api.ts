import request from './request';

export const mbtiApi = {
  /**
   * 计算 MBTI 结果
   */
  calculate: (answers: Record<number, number>) => {
    return request.post('https://openjung.org/api/calculate', {
      answers,
      locale: 'zh',
      save: false
    });
  }
};