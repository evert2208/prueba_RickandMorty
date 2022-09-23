import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Result } from '../interfaces/personaje.interface';


const personajeStg= 'personajes';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  storage: any;
  private personajesObj= new BehaviorSubject<Result[]>([]);
  personajeFav$= this.personajesObj.asObservable();

  constructor(private http: HttpClient) {  this.getStorage();}

  getPersonajes(){
    return this.http.get('https://rickandmortyapi.com/api/character');
  }

  gestionarPersonajes(formulario: any){
    const {id}= formulario;
    const fav= this.getPersonaje();
    const found= !!fav.find((resp: any)=> resp.id===id);
    this.agregarFavorito(formulario);
  }
  getPersonaje(){
    try {
      let data: any = localStorage.getItem(personajeStg);
      const personajes= JSON.parse(data);
      this.personajesObj.next(personajes);
      return personajes
    } catch (error) {
      console.log(error );
    }
  }

  eliminarPersonaje(id: number){
    try {
      const fav= this.getPersonaje();
      const personajes= fav.filter((resp: any) => resp.id !=id);
      localStorage.setItem(personajeStg, JSON.stringify([...personajes]));
      this.personajesObj.next([...personajes]);
    } catch (error) {
      console.log(error);
    }
  }

  private agregarFavorito(formulario: any){
    try {
      const fav= this. getPersonaje();
      localStorage.setItem(personajeStg, JSON.stringify([...fav, formulario]));
      this.personajesObj.next([...fav, formulario]);
    } catch (error) {
      console.log(error);
    }

  }

  getStorage(): void{

    let data: any = localStorage.getItem(personajeStg);
    this.storage= JSON.parse(data);

    if(!this.storage){
      localStorage.setItem(personajeStg, JSON.stringify([]));

    };
    this.getPersonaje();
    return this.storage
  }

  buscar(termino: string){
    return this.http.get(`https://rickandmortyapi.com/api/character/?name=${termino}`);
  }
}
