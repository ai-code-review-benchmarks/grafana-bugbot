package app

import (
	"context"

	"github.com/grafana/grafana-app-sdk/app"
	"github.com/grafana/grafana-app-sdk/logging"
	"github.com/grafana/grafana-app-sdk/operator"
	"github.com/grafana/grafana-app-sdk/resource"
	"github.com/grafana/grafana-app-sdk/simple"

	annov0alpha1 "github.com/grafana/grafana/apps/anno/pkg/apis/anno/v0alpha1"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

func New(cfg app.Config) (app.App, error) {
	simpleConfig := simple.AppConfig{
		Name:       "anno",
		KubeConfig: cfg.KubeConfig,
		InformerConfig: simple.AppInformerConfig{
			InformerOptions: operator.InformerOptions{
				ErrorHandler: func(ctx context.Context, err error) {
					logging.FromContext(ctx).Error("Informer processing error", "error", err)
				},
			},
		},
		ManagedKinds: []simple.AppManagedKind{{
			Kind: annov0alpha1.AnnotationKind(),
		},
		},
	}

	a, err := simple.NewApp(simpleConfig)
	if err != nil {
		return nil, err
	}

	err = a.ValidateManifest(cfg.ManifestData)
	if err != nil {
		return nil, err
	}

	return a, nil
}

func GetKinds() map[schema.GroupVersion][]resource.Kind {
	gv := schema.GroupVersion{
		Group:   annov0alpha1.AnnotationKind().Group(),
		Version: annov0alpha1.AnnotationKind().Version(),
	}
	return map[schema.GroupVersion][]resource.Kind{
		gv: {annov0alpha1.AnnotationKind()},
	}
}
