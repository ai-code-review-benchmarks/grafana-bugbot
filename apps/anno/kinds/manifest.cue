package kinds

manifest: {
	appName: "anno"
  groupOverride: "anno.grafana.app"
	versions: {
	    "v0alpha1": v0alpha1
	}
}

v0alpha1: {
    kinds: [annov0alpha1]
    routes: {
        namespaced: {
            "/tags": {
                "GET": {
                    response: {
                        tags: [...{
                            tag: string
                            count: number
                        }]
                    }
                }
            }
        }
    }
    codegen: {
        ts: {
            enabled: true
        }
        go: {
            enabled: true
        }
    }
}
