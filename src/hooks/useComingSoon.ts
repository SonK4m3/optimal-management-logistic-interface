import { useToast } from '@/components/ui/use-toast.ts'

const useComingSoon = () => {
    const { toast } = useToast()

    const showComingSoon = () => {
        toast({
            variant: 'default',
            title: 'Coming Soon!'
        })
    }

    return { showComingSoon }
}

export default useComingSoon
