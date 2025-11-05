import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

export default function Contact() {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);

        emailjs.sendForm(
          'service_7wpse48', // service id
          'template_0scehhf', // template id
          formRef.current,
          'Q92ok97jwC1cxmvtO' // public key
        )
        .then((result) => {
            console.log(result.text);
            toast.success("Message sent successfully!");
            formRef.current.reset();
            setLoading(false);
        }, (error) => {
            console.log(error.text);
            toast.error("An error occurred, please try again.");
        });
    };

    return (
      <div className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-center">
                <div className="w-full lg:w-10/12">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div className="flex flex-col lg:flex-row">
                            {/* Contact Info */}
                            <div className="lg:w-5/12 bg-gray-900 text-white p-8">
                                <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
                                <p className="mb-6 text-gray-300">
                                    We'd love to hear from you. Please fill out the form or contact us using the information below.
                                </p>

                                <div className="flex items-start mb-6 transition-all duration-300 hover:translate-x-2">
                                    <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <i className="fas fa-map-marker-alt text-white"></i>
                                    </div>
                                    <div>
                                        <h6 className="font-semibold mb-1">Address</h6>
                                        <p className="text-gray-300 text-sm">
                                            Kec. Gedangan, Kabupaten Sidoarjo,<br/>Jawa Timur 61254
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start mb-6 transition-all duration-300 hover:translate-x-2">
                                    <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <i className="fas fa-phone text-white"></i>
                                    </div>
                                    <div>
                                        <h6 className="font-semibold mb-1">Phone</h6>
                                        <p className="text-gray-300 text-sm">+62 831-4697-8084</p>
                                    </div>
                                </div>

                                <div className="flex items-start mb-6 transition-all duration-300 hover:translate-x-2">
                                    <div className="w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <i className="fas fa-envelope text-white"></i>
                                    </div>
                                    <div>
                                        <h6 className="font-semibold mb-1">Email</h6>
                                        <p className="text-gray-300 text-sm">el.mochtaar@gmail.com</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h6 className="font-semibold mb-4">Our Contact</h6>
                                    <div className="flex space-x-3">
                                        <a href="mailto:el.mochtaar@gmail.com" className="w-9 h-9 bg-black bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-indigo-500 hover:-translate-y-1">
                                            <i className="far fa-envelope text-white hover:text-gray-900"></i>
                                        </a>
                                        <a href="https://wa.me/6283146978084" target="_blank" className="w-9 h-9 bg-black bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-indigo-500 hover:-translate-y-1">
                                            <i className="fab fa-whatsapp text-white hover:text-gray-900"></i>
                                        </a>
                                        <a href="https://github.com/UmarUPN" target="_blank" className="w-9 h-9 bg-black bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-indigo-500 hover:-translate-y-1">
                                            <i className="fab fa-github text-white hover:text-gray-900"></i>
                                        </a>
                                        <a href="https://www.instagram.com/el_mochtaar/" target="_blank" className="w-9 h-9 bg-black bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-indigo-500 hover:-translate-y-1">
                                            <i className="fab fa-instagram text-white hover:text-gray-900"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contact Form */}
                            <div className="lg:w-7/12 p-8">
                                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                                <form ref={formRef} onSubmit={sendEmail}>
                                    <div className="mb-4">
                                        <label className="block font-medium mb-2">Your Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-blue-600 focus:outline-none focus:ring-0"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block font-medium mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-blue-600 focus:outline-none focus:ring-0"
                                            placeholder="Must be a valid email!"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block font-medium mb-2">Subject</label>
                                        <input 
                                            type="text" 
                                            name="title"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-blue-600 focus:outline-none focus:ring-0"
                                            placeholder="How can we help?"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="mb-6">
                                        <label className="block font-medium mb-2">Message</label>
                                        <textarea 
                                            name="message"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-blue-600 focus:outline-none focus:ring-0"
                                            rows="5" 
                                            placeholder="Your message here..."
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <button
                                      type="submit" 
                                      disabled={loading}
                                      className={`text-white px-8 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" cursor-pointer ${
                                        loading
                                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                          : "bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                                      }`}
                                    >
                                      {loading ? "Sending message..." : "Send Message"}
                                    </button>
                                </form>

                                <div className="h-48 rounded-xl overflow-hidden mt-6">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d415.89750722990556!2d112.72983911605492!3d-7.386783931226247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e557a676c8af%3A0xf3af60d1036dd8ab!2sIDESIGN!5e0!3m2!1sid!2sid!4v1757496768347!5m2!1sid!2sid"
                                        className="w-full h-full border-0"
                                        allowFullScreen 
                                        loading="lazy"
                                    >
                                    </iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
        
    )
}