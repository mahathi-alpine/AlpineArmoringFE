// import Head from 'next/head';
import HpBanner from '../components/HpBanner';

function Home({ props, error }) {
// const Home = ({ props, error }) => {
  // console.log(props)

  // if (error) {
  //   return null;
  // }

  const data = props?.data.attributes;

  return (
    <div>
      <div className="">
        {data? <HpBanner props={props}/> : null}
      </div>
    </div>
  );
}


export async function getServerSideProps(context) {
  const headers = {
    'Content-Type': 'application/json',
  };
 
  try {
    const response = await fetch('http://localhost:1337/api/homepage?populate=deep', {
      method: 'GET',
      headers,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const props = await response.json();
  
    return {
      props: {
        props: props,
      },
    };
   } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
   }
 }

 
// Home.getInitialProps  = async ctx => {
//   try {
//     const parseJSON = resp => (resp.json ? resp.json() : resp);
//     const checkStatus = resp => {
//       if (resp.status >= 200 && resp.status < 300) {
//         return resp;
//       }

//       return parseJSON(resp).then(resp => {
//         throw resp;
//       });
//     };

//     const headers = {
//       'Content-Type': 'application/json',
//     };

//     const props = await fetch('http://localhost:1337/api/homepage?populate[0]=TopBanner.Media', {
//       method: 'GET',
//       headers,
//     })
//       .then(checkStatus)
//       .then(parseJSON);

//     return { props };
//   } catch (error) {
//     return { error };
//   }
// };

export default Home;