import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../index'
import { CityAPI } from '../../api'
import CitiesStorage from '../../LocalStorage'
import { ICityState, IAction } from '../../ts/interfaces/city-reducer'

const initialState: ICityState = {
  cities: []
}

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    getCities(state: ICityState) {
      const cities: string[] = CitiesStorage.getCities()
      state.cities = [...cities]
    },
    saveCityToStorage(state: ICityState, action) {
      CitiesStorage.addCity(action.payload)
      const cities = CitiesStorage.getCities()
      state.cities = [...cities]
    },
    removeCityFromStorage(state: ICityState, action: IAction) {
      CitiesStorage.removeCity(action.payload)
      const cities: string[] = CitiesStorage.getCities()
      state.cities = [...cities]
    },
    updateCardForecast(state: ICityState, action: IAction) {
      const cities = CitiesStorage.getCities()
      const updated = cities.map((el: any) => {
        if (el.id === action.payload.id) {
          el = { ...action.payload }
        }
      })
      state.cities = [...updated]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateCardForecast.fulfilled, (state: ICityState, action) => {
      updateCardForecast(action.payload)
    })
  }
})

export const { getCities, saveCityToStorage, removeCityFromStorage } = citySlice.actions

export const fetchCityByName = createAsyncThunk(
  'cities/fetchCityByName',
  async (name: string, thunkAPI: any) => {
    const data = await CityAPI.fetchCityData(name)
    thunkAPI.dispatch(saveCityToStorage(data.name))
  }
)

export const fetchCityByNameAndCountryCode = createAsyncThunk(
  'cities/fetchCityByNameAndCountryCode',
  async (value: string, thunkAPI: any) => {
    const data = await CityAPI.fetchCItyByNameAndCode(value)
    const cityData = `${data.name}, ${data.sys.country}`
    thunkAPI.dispatch(saveCityToStorage(cityData))
  }
)

export const updateCardForecast = createAsyncThunk(
  'cities/fetchCardForecast',
  async (city: any, thunkAPI: any) => {
    const data = await CityAPI.fetchCityData(city)
    return data
  }
)

export default citySlice.reducer
