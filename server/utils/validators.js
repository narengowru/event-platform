// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Password strength validation
  const isStrongPassword = (password) => {
    // At least 6 characters
    return password.length >= 6;
  };
  
  // Date validation - check if date is in the future
  const isFutureDate = (date) => {
    const eventDate = new Date(date);
    const now = new Date();
    return eventDate > now;
  };
  
  // MongoDB ObjectId validation
  const isValidObjectId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  };
  
  // Image file type validation
  const isValidImageType = (mimetype) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(mimetype);
  };
  
  module.exports = {
    isValidEmail,
    isStrongPassword,
    isFutureDate,
    isValidObjectId,
    isValidImageType,
  };