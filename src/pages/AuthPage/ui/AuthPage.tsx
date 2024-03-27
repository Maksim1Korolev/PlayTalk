import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Card, HStack, Loader, UiButton, UiInput, UiText, VStack } from '../../../shared/ui'
import { apiService } from '../api/apiAuthService'

interface AuthPageProps {
	className?: string
}

export const AuthPage = ({ className }: AuthPageProps) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const navigate = useNavigate()
	const [cookies, setCookie] = useCookies(['jwt-cookie'])

	const handleUsernameChange = (value: string) => {
		setUsername(value)
	}
	const handlePasswordChange = (value: string) => {
		setPassword(value)
	}

	const {
		mutate: signIn,
		isLoading,
		error,
	} = useMutation(() => apiService.login(username, password), {
		onSuccess: data => {
			const newUser = {
				...data,
				isOnline: true,
			}
			setCookie('jwt-cookie', newUser)
			setIsAuthenticated(true)
		},
		onError: error => {
			console.error(error)
		},
	})

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/')
			window.location.reload()
		}
	}, [isAuthenticated, cookies, navigate])

	const handleSignIn = () => {
		signIn()
	}

	return (
		<div>
			<Card>
				<VStack align="center">
					<HStack gap="16">
						<UiText>Username:</UiText>
						<UiInput value={username} onChange={handleUsernameChange} />
					</HStack>

					<HStack gap="16">
						<UiText>Password:</UiText>
						<UiInput type="password" value={password} onChange={handlePasswordChange} />
					</HStack>
					<UiButton onClick={handleSignIn}>Sign In</UiButton>
					{isLoading && <Loader />}
				</VStack>
			</Card>
		</div>
	)
}
