import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from '../routes/app.routes';
import { AuthRoutes } from '../routes/auth.routes';
import { useAuth } from '../hooks/Auth';

export function Routes() {
    const { user } = useAuth();
    return(
        <NavigationContainer>
            {user.id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    )
}