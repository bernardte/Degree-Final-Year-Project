
import InvoiceDetail from './InvoiceDetail';

const PrintInvoice = () => {
 return (
   <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 print:bg-white">
     <div className="mx-auto max-w-5xl">
       <div className="overflow-hidden rounded-lg bg-white shadow-lg print:shadow-none">
         <InvoiceDetail />
       </div>
       <div className="mt-6 text-center print:hidden">
         <button
           onClick={() => window.print()}
           className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
         >
           Print Invoice
         </button>
       </div>
     </div>
   </div>
 );
}

export default PrintInvoice
