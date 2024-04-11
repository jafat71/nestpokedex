import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokeresponse';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
  ){}
  
  async seed() {
    await this.pokemonService.reset()
    const data = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650")

    const insertPromisesArray = [] 
    //const pokemonToInsert = []

    data.results.forEach(({name,url})=>{
      const id = url.split('/').at(-2)
      insertPromisesArray.push(this.pokemonService.create({no:+id,name}))
      //pokemonToInsert.push({no:+id,name})
    })
    await Promise.all(insertPromisesArray)
    // await this.pokemonModel.insertMany(pokemonToInsert)
    return "SEED EXECUTED";
  }

}
