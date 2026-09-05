import concurrently from 'concurrently'

const { result } = concurrently(
  [
    { command: 'npm run dev', name: 'dev' },
    {
      command: 'node .scripts/wait-for-vite.ts && npm run firefox',
      name: 'firefox',
    },
  ],
  {
    defaultInputTarget: 'firefox',
    handleInput: true,
    killOthersOn: ['success', 'failure'],
    successCondition: 'first',
  },
)

try {
  await result
} catch {
  // concurrently already reports which command failed.
  process.exitCode = 1
}
