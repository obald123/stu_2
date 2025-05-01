process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
import React from 'react';
import api from '../lib/api';

describe('api utility', () => {
  it('should have a baseURL', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });
});
