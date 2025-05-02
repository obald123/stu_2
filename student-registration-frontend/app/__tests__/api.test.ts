process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
import React from 'react';
import axios from 'axios';
import api from '../lib/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('api utility', () => {
  it('should have a baseURL', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });
});

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('adds Authorization header when token exists', async () => {
    const token = 'test-token';
    localStorage.setItem('token', token);

    const config = {
      url: '/test',
      method: 'get'
    };

    mockedAxios.request.mockImplementationOnce(async (config) => {
      return {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    });

    const response = await api.request(config);
    expect(response.config.headers?.Authorization).toBe(`Bearer ${token}`);
  });

  it('does not add Authorization header when token does not exist', async () => {
    const config = {
      url: '/test',
      method: 'get'
    };

    mockedAxios.request.mockImplementationOnce(async (config) => {
      return {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    });

    const response = await api.request(config);
    expect(response.config.headers?.Authorization).toBeUndefined();
  });
});
