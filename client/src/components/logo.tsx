const Logo = () => {
  return (
    <>
      <svg
        width='26'
        height='26'
        viewBox='0 0 26 26'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
        className='text-primary'
      >
        <rect x='9' width='8' height='26' />
        <rect y='9' width='26' height='8' />
      </svg>

      <span className='ml-2 text-xl font-bold'>Health Mate</span>
    </>
  )
}

export default Logo
