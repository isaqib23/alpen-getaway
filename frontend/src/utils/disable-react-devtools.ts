// Disable React DevTools in production

export const disableReactDevTools = (): void => {
  if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = null;
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = null;
  }
};

// Auto-disable in production
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

export default disableReactDevTools;