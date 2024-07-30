import React from 'react'

const Spinner = () => {
  return (
    <div className='fixed left-0 loadingBg right-0 top-0 bottom-0 flex w-full items-center justify-center z-[60]'>
      {/* <img src='/loading.webp' alt='loading' className='absolute left-0 top-0 right-0 bottom-0'/> */}

	<div class="loading-bar absolute top-0">
		<div class="progress-bar"></div>
	</div>
<div className="spinner">
{/* <div className="loaderans">
<img alt="daxy" src="/maxitap.webp" className='w-[100px]'/>
</div>
     */}
     <div class="spinner-box">
  <div class="blue-orbit leo">
  </div>

  <div class="green-orbit leo">
  </div>
  
  <div class="red-orbit leo">
  </div>
  
  <div class="white-orbit w1 leo">
  </div><div class="white-orbit w2 leo">
  </div><div class="white-orbit w3 leo">
  </div>
</div>
</div>
    </div>
  )
}

export default Spinner