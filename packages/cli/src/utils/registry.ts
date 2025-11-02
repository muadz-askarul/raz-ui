import { Component } from './installer';

const REGISTRY_BASE = 'https://raw.githubusercontent.com/muadz-askarul/raz-ui/main/registry';

export async function fetchRegistry(): Promise<any> {
    const response = await fetch(`${REGISTRY_BASE}/index.json`);
    if (!response.ok) {
        throw new Error('Failed to fetch registry');
    }
    return response.json();
}

export async function fetchComponent(name: string): Promise<any> {
    const response = await fetch(`${REGISTRY_BASE}/components/${name}.json`);
    if (!response.ok) {
        throw new Error(`Component "${name}" not found`);
    }
    return response.json();
}
