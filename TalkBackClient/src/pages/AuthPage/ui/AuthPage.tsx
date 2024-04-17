import { cx } from '@/shared/lib/cx'
import { Card, HStack, Loader, UiButton, UiInput, UiText, VStack } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../api/apiAuthService'
import cls from './AuthPage.module.scss'

import resources from '@/public/resources/AuthPageResources.json'

interface AuthPageProps {
	className?: string
}

const AuthPage = ({ className }: AuthPageProps) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isSignUp, setIsSignUp] = useState(false)
	const [error, setError] = useState<string>()
	const navigate = useNavigate()
	const [, setCookie] = useCookies(['jwt-cookie'])

	const handleUsernameChange = (value: string) => {
		setUsername(value)
	}
	const handlePasswordChange = (value: string) => {
		setPassword(value)
	}

	const signInMutation = useMutation(() => apiService.login(username, password), {
		onSuccess: data => {
			setCookie('jwt-cookie', data, { path: '/' })
			setIsAuthenticated(true)
		},
		onError: ({ data }) => {
			setError(data)
		},
	})

	const signUpMutation = useMutation(() => apiService.register(username, password), {
		onSuccess: data => {
			setCookie('jwt-cookie', data, { path: '/' })
			setIsAuthenticated(true)
		},
		onError: ({ data }) => {
			setError(data)
		},
	})

	const handleAuthAction = () => {
		if (isSignUp) {
			signUpMutation.mutate()
		} else {
			signInMutation.mutate()
		}
	}

	const toggleAuthMode = () => {
		setIsSignUp(!isSignUp)
	}

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/')
			window.location.reload()
		}
	}, [isAuthenticated])

	return (
		<VStack className={cx(cls.AuthPage, {}, [className])} max align="center" justify="center">
			<Card max className={cls.card} variant="default" padding="60" border="default">
				<VStack gap="60" max>
					<VStack gap="8" max>
						<UiText size="l" bold fontFamily="main">
							{isSignUp ? resources.title_sign_up : resources.title_login}
						</UiText>
						<UiText size="m" dimmed fontFamily="main">
							{isSignUp ? resources.subtitle_sign_up : resources.subtitle_login}
						</UiText>
						{error && (
							<UiText className={cls.error} color="error">
								{error}
							</UiText>
						)}
					</VStack>
					<VStack gap="45" align="center" max>
						<VStack gap="24" max>
							<VStack max gap="8">
								<UiText size="l" fontFamily="text">
									{resources.label_username}
								</UiText>
								<UiInput
									maxLength={15}
									placeholder={resources.placeholder_username}
									value={username}
									onChange={handleUsernameChange}
									max
								/>
							</VStack>

							<VStack max gap="8">
								<UiText size="l" fontFamily="text">
									{resources.label_password}
								</UiText>
								<UiInput
									maxLength={30}
									placeholder={resources.placeholder_password}
									type="password"
									value={password}
									onChange={handlePasswordChange}
									max
								/>
							</VStack>
						</VStack>

						<HStack gap="16">
							<UiText size="m" fontFamily="main">
								{isSignUp
									? resources.action_already_have_account
									: resources.action_dont_have_account}
							</UiText>

							<UiButton variant="clear" color="blue" onClick={toggleAuthMode} textIsUnderlined>
								<UiText size="m" fontFamily="main">
									{isSignUp ? resources.button_sign_in : resources.button_sign_up}
								</UiText>
							</UiButton>
						</HStack>
						<UiButton max variant="filled" onClick={handleAuthAction}>
							{isSignUp ? resources.button_sign_up : resources.button_sign_in}
						</UiButton>
						{(signInMutation.isLoading || signUpMutation.isLoading) && <Loader />}
					</VStack>
				</VStack>
			</Card>
		</VStack>
	)
}

export default AuthPage
