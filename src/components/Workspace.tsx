export default function Workspace({ theme }: { theme: string }) {
  return (
    <iframe
      className="h-full flex-1"
      src={`https://bitmind-ai.github.io/jupyterlite/lab/index.html?theme=${theme === 'dark' ? 'JupyterLab Dark' : 'JupyterLab Light'}`}
      width="100%"
      height="100%"
    />
  )
}
