import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel("Pokemon")
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error) {
      this.handleException(error)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if (!pokemon) throw new NotFoundException("No pokemon founded: searched by:" + term)
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    //DRY
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true })
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto
      }
    } catch (error) {
      this.handleException(error)
    }

  }

  async remove(id: string) {
    const {deletedCount, acknowledged} = await this.pokemonModel.deleteOne({  _id: id }).exec();
    if(deletedCount===0){
      throw new BadRequestException("Pokemon with id " + id + " not found. Nothing to delete")
    }
    return;
  }

  //Excepciones no controladas
  private handleException(error:any){
    if (error.code === 11000) {
      throw new BadRequestException("Pokemon already exists: " + JSON.stringify(error.keyValue))
    }
    throw new InternalServerErrorException("Error in Server- check server logs")
  }

}
