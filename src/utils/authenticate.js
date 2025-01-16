import CheckToken from './Check';

// Note: Hàm này dùng để bao bọc hàm CheckToken. Mục đích cuối trả về lỗi khi token không tồn tại
export const authenticate = async (request) => {
  const { user, error, body } = await CheckToken(request);
  if (error || !user) throw new Error(error || 'Authentication failed')
  return { user, body }
}; 