import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Restful Booker API Tests', () => {

    let token: string;
    let bookingId: number;

    test('Create Token', async ({ request }) => {
        const response = await request.post('/auth', {
            data: {
                username: 'admin',
                password: 'password123'
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('token');
        token = responseBody.token;
        console.log('Token:', token);
    });

    test('Create Booking', async ({ request }) => {
        const response = await request.post('/booking', {
            data: {
                firstname: 'Leo',
                lastname: 'Das',
                totalprice: 625,
                depositpaid: true,
                bookingdates: {
                    checkin: '2023-10-19',
                    checkout: '2023-11-19'
                },
                additionalneeds: 'Datura'
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('bookingid');
        bookingId = responseBody.bookingid;
        console.log('Booking ID:', bookingId);
    });

    test('Get Booking', async ({ request }) => {
        const response = await request.get(`/booking/${bookingId}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe('Leo');
        console.log('Booking Details:', responseBody);
    });

    test('Update Booking', async ({ request }) => {
        const response = await request.put(`/booking/${bookingId}`, {
            data: {
                firstname: 'Deepak',
                lastname: 'Raj',
                totalprice: 60,
                depositpaid: true,
                bookingdates: {
                    checkin: '2003-03-21',
                    checkout: '2026-02-25'
                },
                additionalneeds: 'Parallel Bars'
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe('Deepak');
        console.log('Updated Booking Details:', responseBody);
    });

    test('Partial Update Booking', async ({ request }) => {
        const response = await request.patch(`/booking/${bookingId}`, {
            data: {
                additionalneeds: 'Gymnastics Rings'
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${token}`
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.additionalneeds).toBe('Gymnastics Rings');
        console.log('Partially Updated Booking Details:', responseBody);
    });

    test('Delete Booking', async ({ request }) => {
        const response = await request.delete(`/booking/${bookingId}`, {
            headers: {
                'Cookie': `token=${token}`
            }
        });
        expect(response.status()).toBe(201);
        console.log('Booking Deleted, Status Code:', response.status());
    });

});
