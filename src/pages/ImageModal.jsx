// // import { useState } from 'react';
// // import { X } from 'lucide-react';

// // const ImageModal = ({ image }) => {
// //   const [isOpen, setIsOpen] = useState(false);

// //   if (!image) return null;

// //   return (
// //     <>
// //       {/* Trigger Button */}
// //       <button
// //         onClick={() => setIsOpen(true)}
// //         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //       >
// //         View Image
// //       </button>

// //       {/* Modal */}
// //       {isOpen && (
// //         <div 
// //           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
// //           onClick={() => setIsOpen(false)}
// //         >
// //           <div 
// //             className="relative max-w-4xl max-h-[90vh] w-full"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             {/* Close Button */}
// //             <button
// //               onClick={() => setIsOpen(false)}
// //               className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
// //             >
// //               <X size={32} />
// //             </button>

// //             {/* Image */}
// //             <img
// //               src={image.image_url}
// //               alt={`Image ${image.id}`}
// //               className="w-full h-full object-contain rounded-lg"
// //             />

// //             {/* Image Info */}
// //             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
// //               <p className="text-sm">ID: {image.id}</p>
// //               <p className="text-xs text-gray-300">
// //                 Uploaded: {new Date(image.uploaded_at).toLocaleString()}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // // Demo usage
// // export default function App() {
// //   const sampleImage = {
// //     id: 2,
// //     image_url: "https://gateway.pinata.cloud/ipfs/QmQAw2AcpzaSJsXDtPvsrifiPUTS6o1T4NmxqcxN3K4fWm",
// //     uploaded_at: "2025-11-23T06:14:56.657401+05:30"
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// //       <div className="bg-white p-8 rounded-lg shadow-lg">
// //         <h1 className="text-2xl font-bold mb-4">Image Modal Demo</h1>
// //         <ImageModal image={sampleImage} />
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from 'react';
// import { X, Image as ImageIcon, Loader2 } from 'lucide-react';

// const ImageModal = ({ image }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
// console.log('ImageModal image prop:', image);

//   if (!image) {
//     console.log('Image not found');
//     return null;
//   }
  
//   return (
//     <>
//       {/* Trigger Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
//       >
//         <ImageIcon className="w-4 h-4" />
//       </button>

//       {/* Modal */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
//           onClick={() => {
//             setIsOpen(false);
//             setIsLoading(true);
//           }}
//         >
//           <div 
//             className="relative max-w-4xl max-h-[90vh] w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
//             >
//               <X size={32} />
//             </button>

//             {/* Loading Spinner */}
//             {isLoading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
//                 <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
//               </div>
//             )}

//             {/* Image */}
//             <img
//               src={image.image_url}
//               alt={`Image ${image.id}`}
//               className="w-full h-full object-contain rounded-lg"
//               onLoad={() => setIsLoading(false)}
//               style={{ display: isLoading ? 'none' : 'block' }}
//             />

//             {/* Image Info */}
//             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
//               <p className="text-sm">ID: {image.id}</p>
//               <p className="text-xs text-gray-300">
//                 Uploaded: {new Date(image.uploaded_at).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // Demo usage
// export default function Appp({image}) {
//     console.log('Appp image prop:', image);
// //   const sampleImage = {
// //     id: 2,
// //     image_url: "https://gateway.pinata.cloud/ipfs/QmQAw2AcpzaSJsXDtPvsrifiPUTS6o1T4NmxqcxN3K4fWm",
// //     uploaded_at: "2025-11-23T06:14:56.657401+05:30"
// //   };

//   return (
//     <div className="bg-gray-100 flex items-center justify-center">
//       <div className="bg-white ">
//         <ImageModal image={image} />
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';

const ImageModal = ({ image }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!image) return null;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => {
            setIsOpen(false);
            setIsLoading(true);
          }}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            )}

            {/* Image */}
            <img
              src={image.image_url}
              alt={`Image ${image.id}`}
              className="w-full h-full object-contain rounded-lg"
              onLoad={() => setIsLoading(false)}
              style={{ display: isLoading ? 'none' : 'block' }}
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
              <p className="text-sm">ID: {image.id}</p>
              <p className="text-xs text-gray-300">
                Uploaded: {new Date(image.uploaded_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;