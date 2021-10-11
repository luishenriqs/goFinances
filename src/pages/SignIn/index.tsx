import React, { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuth } from '../../hooks/Auth';
import { useTheme } from 'styled-components';
//===> expo install expo-linear-gradient;
import { LinearGradient } from 'expo-linear-gradient';
import SignInSocialButton from '../../Components/SignInSocialButton';
//==> yarn add --dev react-native-svg-transformer;
/* Obs: Importante fazer a tipagem dos arquivos 'svg' na pasta '@types' */
import LogoSvg from '../../assets/gofinances.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';
import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles';

export function SignIn() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível conectar a conta Google');
            setIsLoading(false);
        }
    };

    async function handleSignInWithApple() {
        try {
            setIsLoading(true);
            return await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível conectar a conta Apple');
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <LinearGradient
                colors={['#4c669f', '#345995', '#f3a723']}
            >
                <Header>
                    <TitleWrapper>
                        <LogoSvg 
                            width={RFValue(120)}
                            height={RFValue(68)}
                        />
                        <Title>
                            Controle suas {'\n'} 
                            finanças de forma {'\n'} 
                            muito simples
                        </Title>
                    </TitleWrapper>
                    <SignInTitle>
                        Faça o seu login {'\n'}
                        com uma das contas abaixo
                    </SignInTitle>
                </Header>
                <Footer>
                    <FooterWrapper>
                        <SignInSocialButton 
                            title='Entrar com Google'
                            svg={GoogleSvg}
                            onPress={handleSignInWithGoogle}
                        />
                        <SignInSocialButton 
                            title='Entrar com Apple'
                            svg={AppleSvg}
                            onPress={handleSignInWithApple}
                        />
                    </FooterWrapper>
                    { isLoading &&
                        <ActivityIndicator
                            color={theme.colors.shape}
                            style={{ marginTop: 18 }}
                        />
                    }
                </Footer>
            </LinearGradient>
        </Container>
    );
};
