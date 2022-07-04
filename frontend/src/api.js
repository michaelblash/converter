import axios from 'axios';


class Api {
  constructor() {
    const token = localStorage.getItem('token');

    this._client = axios.create({
      baseURL: 'http://localhost:3000/api/',
      timeout: 10000,
      headers: token ? {'Authorization': `Bearer ${token}`} : undefined
    });

  }

  async login(username, password) {
    try {
      const response = await this._client.post('/auth', { username, password });

      const token = response.data.accessToken;

      localStorage.setItem('token', token);
      this._client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  dropToken() {
    this._client.defaults.headers.common['Authorization'] = '';
  }


  getCurrencies(date) {
    return this._client.get('/currencies', { params: {
      date
    }});
  }
}

export default new Api();
