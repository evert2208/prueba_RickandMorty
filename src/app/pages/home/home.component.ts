import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Personaje, Result } from 'src/app/interfaces/personaje.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public id = 0;
  cargando= true;
  public temp: Result[]=[];
  storage: any[]=[];
  public formSubmmited = false;
  public formulario = this.fb.group({
    id: [this.id+1],
    nombre: ['', Validators.required],
    estado: ['', Validators.required],
    genero: ['', Validators.required],

});

busqpersonaje=[];
  constructor(private apiService: ApiService,
              private fb: FormBuilder) { }

  public personajes:Result[]=[];



  ngOnInit(): void {
    this.getPersonajes();
    this.apiService.getStorage();
    let data: any=localStorage.getItem("personajes");
    this.storage= JSON.parse(data);

  }

  getPersonajes(){
    this.cargando=true;
    this.apiService.getPersonajes().subscribe(
      (resp: any) => {
        this.cargando=false;
        this.personajes=resp.results;
        this.temp=resp.results;
        //console.log(this.personajes);
      }
    )
  }
  guardar(){

    this.formSubmmited=true;
    if(this.formulario.invalid) {
      return;
     }

     //console.log(this.formulario.value);

     this.apiService.gestionarPersonajes(this.formulario.value);
     this.apiService.getPersonaje();
     let data: any=localStorage.getItem("personajes");
     this.storage= JSON.parse(data);
     this.id= this.id+1;
  }

  editar(item: any) {
    this.formulario = this.fb.group({
      id: [item.id],
      nombre: [item.nombre, Validators.required],
      estado: [item.estado, Validators.required],
      genero: [item.genero, Validators.required],
  });


  }

  // Eliminar(id: number) {
  //   this.apiService.eliminarPersonaje(id);
  // }

  getBusqueda(termino: string){
    if(termino.length===0){
      return this.personajes=this.temp;
}
    this.apiService.buscar(termino).subscribe(
      (resp: any) => {
        //console.log(resp);
        this.personajes=resp.results;
      }
    );
    return;
  }
}
