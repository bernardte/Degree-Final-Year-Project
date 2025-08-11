import React, { SetStateAction } from 'react'

const CTASection = ({ setOpenForm } : {setOpenForm: React.Dispatch<SetStateAction<boolean>>}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Create Unforgettable Memories?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl">
          Contact our event specialists today for a personalized consultation
        </p>
        <button
          onClick={() => setOpenForm(true)}
          className="cursor-pointer rounded-full bg-white px-8 py-3 font-bold text-blue-600 transition duration-300 hover:bg-blue-50"
        >
          Schedule a Tour
        </button>
      </div>
    </div>
  );
}

export default CTASection
