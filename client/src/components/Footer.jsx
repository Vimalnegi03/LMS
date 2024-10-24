import {BsWhatsapp,BsInstagram,BsLinkedin,BsGithub} from 'react-icons/bs'
function Footer()
{
    const currentDate=new Date();
    const year=currentDate.getFullYear();
return (
    <>
    <footer className='relative left-0 bottom-0 h-[10vh] flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 py-5 sm:px:20'>
    <section className='text-lg bg-black ml-20'>
    Copyright {year}|All rights reserved
    </section>
    <section className='flex item-center justify-center gap-5 text-2xl text-white mr-4'>
        <a className='hover:text-yellow-500 transition-all ease-in-out duration-300 hover:text-4xl  text-green-400' href="">
            <BsWhatsapp/>
        </a>
        <a className='hover:text-yellow-500 transition-all ease-in-out duration-300 hover:text-4xl  text-pink-500' href="">
            <BsInstagram/>
        </a>
        <a className='hover:text-yellow-500 transition-all ease-in-out duration-300 hover:text-4xl  text-blue-600' href="">
            <BsLinkedin/>
        </a>
        <a className='hover:text-yellow-500 hover:text-4xl transition-all ease-in-out duration-300 ' href="">
            <BsGithub/>
        </a>
    </section>
    
    </footer>
    </>
)
}
export default Footer