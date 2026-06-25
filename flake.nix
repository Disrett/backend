{
  description = "Sans Limites — environnement de test (NestJS + Prisma + k3d)";

  # Évalué avec Lix (fork de Nix). Lix consomme les flakes et nixpkgs à
  # l'identique : aucune adaptation du contenu n'est nécessaire, on l'utilise
  # simplement avec la commande `nix` fournie par Lix (cf. LIX.md).

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          # Tout l'outillage du projet, versions épinglées par le flake.lock
          buildInputs = with pkgs; [
            nodejs_22 # runtime + npm
            prisma # CLI Prisma (doit matcher @prisma/client du package.json)
            prisma-engines # les engines Rust compilés pour Nix
            postgresql_16 # client psql + serveur pour tester en local
            openssl # requis par les engines Prisma
            docker # client Docker (le démon doit tourner à part)
            kubectl # interaction avec le cluster
            k3d # création du cluster k3s-in-docker
            kubernetes-helm # optionnel, si vous ajoutez des charts plus tard
	    curl
	    jq
	    go-task
          ];

          # Câble Prisma sur les engines fournis par Nix (cf. piège ci-dessus)
          shellHook = ''
            export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig"
            export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
            export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
            export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
            export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"

            echo "🧪 Environnement Sans Limites prêt."
            echo "   node $(node --version) | prisma $(prisma --version 2>/dev/null | head -1)"
            echo "   k3d $(k3d version 2>/dev/null | head -1)"
            echo ""
            echo "⚠  Vérifiez que la version de 'prisma' ci-dessus correspond à"
            echo "   @prisma/client dans package.json, sinon ajustez l'un ou l'autre."
          '';
        };
      });
}
