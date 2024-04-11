import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokeresponse';

@Injectable()
export class SeedService {


  async seed() {
    const {data} = await axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=1")
    data.results.forEach(({name,url})=>{
      const id = url.split('/').at(-2)
      console.log(id, name)
    })
    return data.results;
  }

}
