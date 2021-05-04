//will be referred in the UI.
const getWeb3 = () =>{

    new Promise((resolve,reject) => {
      window.addEventListener("load",async ()=>{
  
        if(window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try{
            await window.ethereum.enable();
            resolve(web3);
          } catch(err) {
            console.log(err);
            reject(err);
          }
  
        }
        else if(window.web3) {
          const web3= window.web3;
          console.log('injected web3 peovider')
          resolve(web3);
        }
      })
    })
  }