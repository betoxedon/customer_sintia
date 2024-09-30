
import apiAuth from './apiAuth';

export default {

    getData(){        
        return apiAuth.get('users/dashboard_numbers') 
          .then(res => {
              return res;
          })
          .catch(error => {
              throw error;
          });
  },


}