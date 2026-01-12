package anno

import (
	"context"

	"k8s.io/apiserver/pkg/authorization/authorizer"
	restclient "k8s.io/client-go/rest"

	"github.com/grafana/grafana-app-sdk/app"
	appsdkapiserver "github.com/grafana/grafana-app-sdk/k8s/apiserver"
	"github.com/grafana/grafana-app-sdk/simple"
	apis "github.com/grafana/grafana/apps/anno/pkg/apis/manifestdata"
	annoapp "github.com/grafana/grafana/apps/anno/pkg/app"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/setting"
)

var (
	_ appsdkapiserver.AppInstaller = (*AnnotationAppInstaller)(nil)
)

type AnnotationAppInstaller struct {
	appsdkapiserver.AppInstaller
	cfg *setting.Cfg
}

func RegisterAppInstaller(
	cfg *setting.Cfg,
	features featuremgmt.FeatureToggles,
) (*AnnotationAppInstaller, error) {
	installer := &AnnotationAppInstaller{
		cfg: cfg,
	}
	provider := simple.NewAppProvider(apis.LocalManifest(), nil, annoapp.New)

	appConfig := app.Config{
		KubeConfig:   restclient.Config{}, // this will be overridden by the installer's InitializeApp method
		ManifestData: *apis.LocalManifest().ManifestData,
	}
	i, err := appsdkapiserver.NewDefaultAppInstaller(provider, appConfig, apis.NewGoTypeAssociator())
	if err != nil {
		return nil, err
	}
	installer.AppInstaller = i

	return installer, nil
}

func (a *AnnotationAppInstaller) GetAuthorizer() authorizer.Authorizer {
	return authorizer.AuthorizerFunc(
		func(ctx context.Context, a authorizer.Attributes) (authorizer.Decision, string, error) {
			return authorizer.DecisionAllow, "", nil
		},
	)
}
