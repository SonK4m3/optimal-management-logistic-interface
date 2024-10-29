import React from 'react'
import { LayoutGrid, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import useOauth from '@/hooks/useOauth'
import { User, OAuthProvider } from '@/types'

interface UserNavProps {
    user: User
}

const UserNav: React.FC<UserNavProps> = ({ user }) => {
    const { authenticate } = useOauth()

    const handleLogout = (provider: OAuthProvider) => {
        authenticate(provider).disconnectMethod()
    }

    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' className='relative h-8 w-8 rounded-full'>
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage src={user.picture} alt={user.name} />
                                    <AvatarFallback className='bg-transparent'></AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>Profile</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>{user.name}</p>
                        <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className='hover:cursor-pointer' asChild>
                        <Link to='/bots' className='flex items-center'>
                            <LayoutGrid className='w-4 h-4 mr-3 text-muted-foreground' />
                            Bots
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='hover:cursor-pointer'
                    onClick={() => handleLogout('GOOGLE')}
                >
                    <LogOut className='w-4 h-4 mr-3 text-muted-foreground' />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserNav
