import Link from 'next/link'

interface ActionButtonProps {
    pagePath: string;
    text: string;
}

const ActionButton = ({ pagePath, text }: ActionButtonProps) => (
    <Link href={pagePath}>
        <div className="mx-8 inline py-4 px-6 border border-solid border-violet-900 rounded-lg text-lg float hover:bg-violet-900 hover:text-white hover:cursor-pointer">
            {text}
        </div>
    </Link>
)

export default ActionButton;