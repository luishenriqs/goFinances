import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';
import { Button, ImageContainer, Text } from './styles';

interface IProps extends RectButtonProps {
    title: string;
    svg: React.FC<SvgProps>
}

export default function SignInSocialButton({
    title,
    svg: Svg,
    ...rest
}: IProps) {
    return (
        <Button {...rest}>
            <ImageContainer>
                <Svg />
            </ImageContainer>
            <Text>{title}</Text>

        </Button>
    );
}