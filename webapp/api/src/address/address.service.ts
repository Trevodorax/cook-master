import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateAddressDto } from 'src/premise/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createAddress(address: CreateAddressDto) {
    const coords = await this.getCoordsFromAddress(
      address.streetNumber,
      address.streetName,
      address.postalCode,
      address.city,
      address.country,
      1,
    );

    const newAddress = await this.prisma.address.create({
      data: {
        streetName: address.streetName,
        streetNumber: address.streetNumber,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        longitude: coords.confidence > 0.9 ? coords.lon : null,
        latitude: coords.confidence > 0.9 ? coords.lat : null,
      },
    });

    return newAddress;
  }

  async getCoordsFromAddress(
    houseNumber: string,
    streetName: string,
    postCode: string,
    city: string,
    country: string,
    nbResultsMax: number,
  ): Promise<{ lon: number; lat: number; confidence: number }> {
    const geocodingAPIKey = this.configService.get('GEOCODING_API_KEY');

    const rawResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?housenumber=${encodeURIComponent(
        houseNumber,
      )}&street=${encodeURIComponent(streetName)}
      &postcode=${encodeURIComponent(postCode)}&city=${encodeURIComponent(
        city,
      )}&country=${encodeURIComponent(
        country,
      )}&limit=${nbResultsMax}&format=json&apiKey=${geocodingAPIKey}`,
    );

    try {
      const response = await rawResponse.json();

      if (!response?.results[0]) {
        return null;
      }

      return {
        lon: response.results[0].lon,
        lat: response.results[0].lat,
        confidence: response.results[0].rank.confidence,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
