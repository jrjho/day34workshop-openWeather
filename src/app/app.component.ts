import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom, map } from 'rxjs';
import { Observable, Subscription } from 'rxjs';
import { Weather } from 'src/app/model';

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const WEATHER_API_KEY = '0aaf8013ab6313183faa879f1879cdf5'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'day34workshop';

  form!: FormGroup

  weatherProm$!: Promise<Weather[]>
  result: Weather[]=[]

  constructor(private formBuilder:FormBuilder, private httpCilent: HttpClient) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      city: this.formBuilder.control<string>('', [Validators.required])
    })
  }

  getWeatherWithPromise2() {
    // converts the first value of the observable
    // into a promise, lastValueFrom()
    this.weatherProm$ = lastValueFrom(
      // returns an observable
      this.getWeather()
    )
  }

  getWeather() {
    // const city = this.form.value['city']
    // create query params
    const params = new HttpParams()
        .set('q', this.form.value['city'])
        .set('units', 'metric')
        .set('appid', WEATHER_API_KEY)

    // returns an observable
    return this.httpCilent.get<Weather[]>(WEATHER_URL, { params })
      .pipe(
        map((v: any) => {
          // .main.temp
          const temp = v['main']['temp']
          // .weather
          const weather = v['weather'] as any[]
          return weather.map(w => {
            return {
              main: w['main'],
              description: w['description'],
              icon: w['icon'],
              temperature: temp
            } as Weather
          })
        })
      )
  }

  
}
