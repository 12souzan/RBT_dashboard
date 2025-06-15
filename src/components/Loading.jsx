import { CircularProgress } from '@mui/material'
import React from 'react'

function Loading() {
    return (
        <div className='flex items-center justify-center gap-2 h-[100vh] bg-transparent'>
            <CircularProgress color="secondary" size='20px' />
            <p className="text-center text-[20px] font-medium ">Loading...</p>
        </div>
    )
}

export default Loading