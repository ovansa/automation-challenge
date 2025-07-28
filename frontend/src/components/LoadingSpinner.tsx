export const LoadingSpinner = () => (
  <div
    className='flex justify-center items-center py-8'
    data-testid='loading-spinner-wrapper'
  >
    <div
      className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'
      data-testid='loading-spinner'
    ></div>
  </div>
);
